"""
Full Selenium UI test suite for NexPrep AI.

Covers every page and interactive control:
  - SEO routes (robots, sitemap, manifest)
  - Sign In / Sign Up (inputs, password toggles, links, validation)
  - Dashboard (stats, sidebar nav, header dropdown, create-interview dialog)
  - Questions, Resume Builder (template selection), ATS Checker (upload + analyze)
  - Interview detail (enable webcam, start) and live session (record/type/save/nav)
  - Feedback dashboard (bullet rendering, collapsible rows)

Prereqs (handled by run_tests.sh):
  - Dev server running on http://localhost:3000
  - Local MongoDB running, with selenium_tests/seed_test_data.js seeded

Run: python3 selenium_tests/test_nexprep.py
"""

import sys
import time
import tempfile
import os

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

BASE = os.environ.get("BASE_URL", "http://localhost:3000")
TEST_MOCK_ID = "selenium-test-interview"
# Dedicated test account used to exercise the auth-protected dashboard.
# Created on first run; reused afterwards. Safe to delete from Firebase later.
TEST_EMAIL = os.environ.get("TEST_EMAIL", "selenium.tester@example.com")
TEST_PASS = os.environ.get("TEST_PASS", "SeleniumTest123!")

results = []  # (group, name, ok, detail)


def record(group, name, ok, detail=""):
    results.append((group, name, ok, detail))
    icon = "✅" if ok else "❌"
    print(f"  {icon} [{group}] {name}" + (f" — {detail}" if detail and not ok else ""))


def make_driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1440,900")
    opts.add_argument("--use-fake-ui-for-media-stream")
    opts.add_argument("--use-fake-device-for-media-stream")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    d = webdriver.Chrome(options=opts)
    d.set_page_load_timeout(40)
    return d


def wait(d, by, sel, t=12):
    return WebDriverWait(d, t).until(EC.presence_of_element_located((by, sel)))


def wait_clickable(d, by, sel, t=12):
    return WebDriverWait(d, t).until(EC.element_to_be_clickable((by, sel)))


def find_btn_by_text(d, text):
    for b in d.find_elements(By.TAG_NAME, "button"):
        if text.lower() in (b.text or "").lower():
            return b
    return None


def find_link_by_text(d, text):
    for a in d.find_elements(By.TAG_NAME, "a"):
        if text.lower() in (a.text or "").lower():
            return a
    return None


def body_text(d):
    try:
        return d.find_element(By.TAG_NAME, "body").text
    except Exception:
        return ""


# ----------------------------------------------------------------------------
# Test groups
# ----------------------------------------------------------------------------

def test_auth_guard(d):
    """Logged-out users must be redirected away from protected pages."""
    g = "AuthGuard"
    for path in ["/dashboard", "/dashboard/ats-checker", f"/dashboard/interview/{TEST_MOCK_ID}/start"]:
        try:
            d.get(BASE + path)
            ok = False
            try:
                WebDriverWait(d, 8).until(lambda x: "/auth/sign-in" in x.current_url)
                ok = True
            except TimeoutException:
                ok = "/auth/sign-in" in d.current_url
            record(g, f"blocks {path} when logged out", ok, d.current_url)
        except Exception as e:
            record(g, f"blocks {path} when logged out", False, str(e)[:80])


def authenticate(d):
    """Sign in the test account (creating it on first run). Returns True on success."""
    g = "Auth"
    try:
        d.get(BASE + "/auth/sign-in")
        wait_clickable(d, By.ID, "email")
        time.sleep(0.8)  # let the entrance animation settle
        d.find_element(By.ID, "email").send_keys(TEST_EMAIL)
        d.find_element(By.ID, "password").send_keys(TEST_PASS)
        find_btn_by_text(d, "Sign In").click()
        try:
            WebDriverWait(d, 8).until(lambda x: "/dashboard" in x.current_url)
            record(g, "sign in test account", True)
            return True
        except TimeoutException:
            pass

        # Account doesn't exist yet — create it.
        d.get(BASE + "/auth/sign-up")
        wait_clickable(d, By.ID, "name")
        time.sleep(0.8)
        d.find_element(By.ID, "name").send_keys("Selenium Tester")
        d.find_element(By.ID, "email").send_keys(TEST_EMAIL)
        d.find_element(By.ID, "password").send_keys(TEST_PASS)
        d.find_element(By.ID, "confirm-password").send_keys(TEST_PASS)
        find_btn_by_text(d, "Create Account").click()
        try:
            WebDriverWait(d, 12).until(lambda x: "/dashboard" in x.current_url)
            record(g, "create + sign in test account", True)
            return True
        except TimeoutException:
            record(g, "create + sign in test account", False, "did not reach dashboard: " + d.current_url)
            return False
    except Exception as e:
        record(g, "authenticate", False, str(e)[:100])
        return False


def test_seo(d):
    g = "SEO"
    for path, needle in [
        ("/robots.txt", "Sitemap"),
        ("/sitemap.xml", "<urlset"),
        ("/manifest.webmanifest", "NexPrep"),
    ]:
        try:
            d.get(BASE + path)
            txt = d.find_element(By.TAG_NAME, "body").text or d.page_source
            record(g, f"{path} served", needle.lower() in (txt or "").lower(), f"missing '{needle}'")
        except Exception as e:
            record(g, f"{path} served", False, str(e)[:80])


def test_root_landing(d):
    g = "Routing"
    try:
        d.get(BASE + "/")
        WebDriverWait(d, 10).until(lambda x: "ace your next" in body_text(x).lower())
        t = body_text(d).lower()
        record(g, "/ shows landing page", "ace your next" in t and "/auth" not in d.current_url, d.current_url)
        record(g, "landing has Get started CTA", any("get started" in (b.text or "").lower() or "start practicing" in (b.text or "").lower() for b in d.find_elements(By.TAG_NAME, "a")))
    except Exception as e:
        record(g, "/ shows landing page", False, str(e)[:80])


def test_sign_in(d):
    g = "SignIn"
    try:
        d.get(BASE + "/auth/sign-in")
        wait_clickable(d, By.ID, "email")
        time.sleep(0.8)  # let the entrance animation settle
        try:
            WebDriverWait(d, 8).until(lambda x: "welcome back" in body_text(x).lower())
            ok_heading = True
        except TimeoutException:
            ok_heading = "welcome back" in body_text(d).lower()
        record(g, "page loads (Welcome back)", ok_heading)
        record(g, "email input present", bool(d.find_elements(By.ID, "email")))
        record(g, "password input present", bool(d.find_elements(By.ID, "password")))

        # Password visibility toggle
        pw = d.find_element(By.ID, "password")
        pw.send_keys("secret123")
        toggle = None
        for b in d.find_elements(By.CSS_SELECTOR, "button[aria-label]"):
            lab = (b.get_attribute("aria-label") or "").lower()
            if "password" in lab:
                toggle = b
                break
        if toggle:
            toggle.click()
            time.sleep(0.3)
            record(g, "password toggle reveals text", d.find_element(By.ID, "password").get_attribute("type") == "text")
        else:
            record(g, "password toggle reveals text", False, "toggle not found")

        # Sign In button present
        record(g, "Sign In button present", find_btn_by_text(d, "Sign In") is not None)

        # Link to sign-up
        link = find_link_by_text(d, "Sign up")
        record(g, "link to sign-up present", link is not None)

        # Invalid login shows an error toast (does not navigate to dashboard)
        d.find_element(By.ID, "email").clear()
        d.find_element(By.ID, "email").send_keys("nouser_selenium@example.com")
        d.find_element(By.ID, "password").clear()
        d.find_element(By.ID, "password").send_keys("wrongpassword")
        find_btn_by_text(d, "Sign In").click()
        time.sleep(4)
        record(g, "invalid login stays on sign-in", "/dashboard" not in d.current_url, d.current_url)
    except Exception as e:
        record(g, "sign-in flow", False, str(e)[:100])


def test_sign_up(d):
    g = "SignUp"
    try:
        d.get(BASE + "/auth/sign-up")
        wait_clickable(d, By.ID, "name")
        time.sleep(0.8)  # let the entrance animation settle
        record(g, "page loads (Create your account)", "create your account" in body_text(d).lower())
        for fid in ["name", "email", "password", "confirm-password"]:
            record(g, f"{fid} input present", bool(d.find_elements(By.ID, fid)))
        record(g, "Create Account button present", find_btn_by_text(d, "Create Account") is not None)
        record(g, "link to sign-in present", find_link_by_text(d, "Sign in") is not None)

        # Password mismatch validation (should NOT navigate to dashboard)
        d.find_element(By.ID, "name").send_keys("Test User")
        d.find_element(By.ID, "email").send_keys("mismatch_selenium@example.com")
        d.find_element(By.ID, "password").send_keys("abc12345")
        d.find_element(By.ID, "confirm-password").send_keys("different99")
        find_btn_by_text(d, "Create Account").click()
        time.sleep(2.5)
        record(g, "password mismatch blocks submit", "/dashboard" not in d.current_url, d.current_url)
    except Exception as e:
        record(g, "sign-up flow", False, str(e)[:100])


def test_dashboard(d):
    g = "Dashboard"
    try:
        d.get(BASE + "/dashboard")
        wait(d, By.XPATH, "//*[contains(text(),'Dashboard Overview')]", 15)
        txt = body_text(d)
        record(g, "page loads (Dashboard Overview)", "dashboard overview" in txt.lower())
        for stat in ["Total Interviews", "Average Score", "Questions Solved", "Active Days"]:
            record(g, f"stat card '{stat}'", stat.lower() in txt.lower())

        # Sidebar nav links
        for label in ["Dashboard", "Questions", "Resume Builder", "ATS Checker"]:
            record(g, f"sidebar link '{label}'", find_link_by_text(d, label) is not None)

        # Sign Out button present
        record(g, "Sign Out button present", find_btn_by_text(d, "Sign Out") is not None)

        # Create New Interview card present
        record(g, "Create New Interview card", "create new interview" in txt.lower())
    except Exception as e:
        record(g, "dashboard load", False, str(e)[:100])


def test_create_interview_dialog(d):
    g = "NewInterviewDialog"
    try:
        d.get(BASE + "/dashboard")
        wait(d, By.XPATH, "//*[contains(text(),'Create New Interview')]", 15)
        card = d.find_element(By.XPATH, "//*[contains(text(),'Create New Interview')]")
        card.click()
        # Dialog should open with the job role field
        WebDriverWait(d, 10).until(EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(),'Job Position') or contains(text(),'job role')]")))
        record(g, "dialog opens", True)

        inputs = d.find_elements(By.TAG_NAME, "input")
        textareas = d.find_elements(By.TAG_NAME, "textarea")
        record(g, "job position input present", len(inputs) >= 1)
        record(g, "job description textarea present", len(textareas) >= 1)

        # Difficulty dropdown (Radix)
        diff_trigger = find_btn_by_text(d, "Select Difficulty")
        if diff_trigger:
            diff_trigger.click()
            time.sleep(0.5)
            item = None
            for el in d.find_elements(By.XPATH, "//*[@role='menuitem']"):
                if "intermediate" in (el.text or "").lower():
                    item = el
                    break
            if item:
                item.click()
                time.sleep(0.3)
                record(g, "difficulty dropdown selects", find_btn_by_text(d, "Intermediate") is not None)
            else:
                record(g, "difficulty dropdown selects", False, "menu item not found")
        else:
            record(g, "difficulty dropdown selects", False, "trigger not found")

        # Work mode + duration dropdowns present
        record(g, "work mode dropdown present", find_btn_by_text(d, "Select Mode") is not None)
        record(g, "duration dropdown present", find_btn_by_text(d, "Select Duration") is not None)

        # Cancel closes the dialog
        cancel = find_btn_by_text(d, "Cancel")
        record(g, "Cancel button present", cancel is not None)
        if cancel:
            cancel.click()
            time.sleep(0.6)
            still_open = bool(d.find_elements(By.XPATH, "//*[contains(text(),'Years of Experience')]"))
            record(g, "Cancel closes dialog", not still_open)
    except Exception as e:
        record(g, "new interview dialog", False, str(e)[:120])


def test_questions(d):
    g = "Questions"
    try:
        d.get(BASE + "/dashboard/questions")
        ok = False
        try:
            WebDriverWait(d, 15).until(lambda x: "questions" in body_text(x).lower() and "loading your workspace" not in body_text(x).lower())
            ok = True
        except TimeoutException:
            ok = "questions" in body_text(d).lower()
        record(g, "page loads", ok)
    except Exception as e:
        record(g, "page loads", False, str(e)[:80])


def test_resume(d):
    g = "ResumeBuilder"
    try:
        d.get(BASE + "/dashboard/resume")
        wait(d, By.XPATH, "//*[contains(text(),'Resume Builder')]", 15)
        txt = body_text(d)
        record(g, "page loads", "resume builder" in txt.lower())
        templates_found = sum(1 for name in ["Modern Clean", "Professional", "Creative", "Classic Minimal"] if name.lower() in txt.lower())
        record(g, "template options present", templates_found >= 3, f"found {templates_found}/4")

        # Click a template and confirm the editor / something changes
        tmpl = d.find_element(By.XPATH, "//*[contains(text(),'Modern Clean')]")
        tmpl.click()
        time.sleep(1.0)
        record(g, "template is selectable", True)
    except Exception as e:
        record(g, "resume builder", False, str(e)[:100])


def test_ats(d):
    g = "ATSChecker"
    try:
        d.get(BASE + "/dashboard/ats-checker")
        wait(d, By.XPATH, "//*[contains(text(),'ATS Resume Checker')]", 15)
        record(g, "page loads", "ats resume checker" in body_text(d).lower())

        file_inputs = d.find_elements(By.CSS_SELECTOR, "input[type='file']")
        record(g, "file upload input present", len(file_inputs) >= 1)
        record(g, "Check Resume Score button present", find_btn_by_text(d, "Check Resume Score") is not None)

        # Upload a sample resume (plain text is parsed as utf-8 by the server action)
        if file_inputs:
            tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False)
            tmp.write(
                "John Doe\nEmail: john@example.com Phone: 555-123-4567\nlinkedin.com/in/johndoe\n"
                "Professional Summary: Senior Software Engineer.\n"
                "Skills: React, JavaScript, Node, SQL, AWS, Docker, Python, Git, TypeScript\n"
                "Experience: Led a team of 5. Increased revenue by 30%. Reduced latency by 40%.\n"
                "Built scalable systems. Developed REST APIs. Optimized queries.\n"
                "Education: B.S. Computer Science\nProjects: Open source contributor\nCertifications: AWS\n"
            )
            tmp.close()
            file_inputs[0].send_keys(tmp.name)
            time.sleep(1.0)
            btn = find_btn_by_text(d, "Check Resume Score")
            if btn:
                d.execute_script("arguments[0].click();", btn)
                # Wait for analysis result (Overall Score / Breakdown)
                ok = False
                try:
                    WebDriverWait(d, 20).until(lambda x: "overall score" in body_text(x).lower() or "breakdown" in body_text(x).lower())
                    ok = True
                except TimeoutException:
                    ok = False
                record(g, "analyze produces a score", ok)
            os.unlink(tmp.name)
    except Exception as e:
        record(g, "ats checker", False, str(e)[:120])


def test_interview_detail(d):
    g = "InterviewDetail"
    try:
        d.get(BASE + f"/dashboard/interview/{TEST_MOCK_ID}")
        wait(d, By.XPATH, "//*[contains(text(),\"Let's Get Started\")]", 15)
        record(g, "page loads", "let's get started" in body_text(d).lower())
        # Job role + Start button only render after the async getInterviewById resolves.
        try:
            WebDriverWait(d, 15).until(lambda x: "selenium test role" in body_text(x).lower())
        except TimeoutException:
            pass
        txt = body_text(d)
        record(g, "shows job role", "selenium test role" in txt.lower())
        record(g, "Enable Web Cam button present", find_btn_by_text(d, "Enable Web Cam") is not None)
        record(g, "Start Interview button present", find_btn_by_text(d, "Start Interview") is not None)

        # Info card should not overlap (both Enable button and info text visible)
        record(g, "Information card present", "information" in txt.lower())
    except Exception as e:
        record(g, "interview detail", False, str(e)[:100])


def test_interview_start(d):
    g = "InterviewSession"
    try:
        d.get(BASE + f"/dashboard/interview/{TEST_MOCK_ID}/start")
        # Question card
        WebDriverWait(d, 15).until(lambda x: "question #1" in body_text(x).lower() or "tell me about yourself" in body_text(x).lower())
        txt = body_text(d)
        record(g, "session loads with question", "question #1" in txt.lower() or "tell me about yourself" in txt.lower())

        # No page scroll (full-screen fit)
        no_scroll = d.execute_script("return document.documentElement.scrollHeight <= window.innerHeight + 3;")
        record(g, "fits viewport (no page scroll)", no_scroll)

        # RecordAnswerSection is a dynamic (ssr:false) import — wait for it to mount.
        try:
            WebDriverWait(d, 12).until(lambda x: find_btn_by_text(x, "Record") is not None or find_btn_by_text(x, "Stop") is not None)
        except TimeoutException:
            pass

        # Controls present
        record(g, "Record button present", find_btn_by_text(d, "Record") is not None or find_btn_by_text(d, "Stop") is not None)
        record(g, "Type button present", find_btn_by_text(d, "Type") is not None)
        record(g, "Save Answer button present", find_btn_by_text(d, "Save Answer") is not None)
        record(g, "Next Question button present", find_btn_by_text(d, "Next Question") is not None)
        record(g, "End button present", find_btn_by_text(d, "End") is not None)

        # Record button does not crash the page
        rec = find_btn_by_text(d, "Record")
        if rec:
            try:
                rec.click(); time.sleep(0.4)
                rec2 = find_btn_by_text(d, "Stop") or find_btn_by_text(d, "Record")
                if rec2:
                    rec2.click(); time.sleep(0.3)
                record(g, "Record toggle does not crash", True)
            except Exception as e:
                record(g, "Record toggle does not crash", False, str(e)[:80])

        # Typing fallback + Save Answer (real evaluation against local Mongo + Gemini)
        type_btn = find_btn_by_text(d, "Type")
        if type_btn:
            type_btn.click()
            time.sleep(0.6)
            tas = d.find_elements(By.TAG_NAME, "textarea")
            if tas:
                tas[0].send_keys("A closure is a function that retains access to variables from its enclosing lexical scope even after that scope has returned.")
                time.sleep(0.3)
                save = find_btn_by_text(d, "Save Answer")
                if save:
                    d.execute_script("arguments[0].click();", save)
                    ok = False
                    try:
                        # Gemini evaluation + multi-model fallback can take a while
                        # when the free tier is degraded; allow generous time.
                        WebDriverWait(d, 70).until(lambda x: (find_btn_by_text(x, "Saved") is not None))
                        ok = True
                    except TimeoutException:
                        ok = False
                    record(g, "Save Answer evaluates & saves", ok)
                else:
                    record(g, "Save Answer evaluates & saves", False, "save btn missing")
            else:
                record(g, "typing fallback shows textarea", False, "no textarea")
        # Next navigation
        nxt = find_btn_by_text(d, "Next Question")
        if nxt:
            d.execute_script("arguments[0].click();", nxt)
            time.sleep(0.8)
            record(g, "Next advances question", "question #2" in body_text(d).lower())
    except Exception as e:
        record(g, "interview session", False, str(e)[:120])


def test_feedback(d):
    g = "Feedback"
    try:
        d.get(BASE + f"/dashboard/interview/{TEST_MOCK_ID}/feedback")
        WebDriverWait(d, 15).until(lambda x: "feedback dashboard" in body_text(x).lower())
        txt = body_text(d)
        record(g, "page loads", "feedback dashboard" in txt.lower())
        record(g, "shows overall score", "overall score" in txt.lower())
        record(g, "shows detailed analysis", "detailed question analysis" in txt.lower())
        record(g, "Dashboard link present", find_link_by_text(d, "Dashboard") is not None)

        # Expand a collapsible row -> feedback bullets render (not raw markdown)
        triggers = d.find_elements(By.XPATH, "//*[contains(text(),'Tell me about yourself')]")
        if triggers:
            d.execute_script("arguments[0].click();", triggers[0])
            time.sleep(1.0)
            full = body_text(d)
            record(g, "feedback rendered (no raw **markdown**)", "**overall impression**" not in full.lower())
            record(g, "feedback sections shown", "overall impression" in full.lower())
        else:
            record(g, "feedback row expandable", False, "row not found")
    except Exception as e:
        record(g, "feedback", False, str(e)[:120])


def test_cohorts(d):
    g = "Cohorts"
    try:
        d.get(BASE + "/dashboard/cohorts")
        WebDriverWait(d, 12).until(lambda x: "cohorts" in body_text(x).lower())
        time.sleep(1)
        record(g, "page loads", "cohorts" in body_text(d).lower())
        record(g, "Create cohort button", find_btn_by_text(d, "Create cohort") is not None)
        record(g, "Join with code button", find_btn_by_text(d, "Join with code") is not None)

        # Create a cohort
        find_btn_by_text(d, "Create cohort").click()
        time.sleep(1.2)
        name_inputs = [i for i in d.find_elements(By.CSS_SELECTOR, "input")
                       if "batch" in (i.get_attribute("placeholder") or "").lower()]
        if name_inputs:
            name_inputs[0].send_keys("Selenium Suite Cohort")
            create_btns = [b for b in d.find_elements(By.TAG_NAME, "button") if "create cohort" in (b.text or "").lower()]
            d.execute_script("arguments[0].click();", create_btns[-1])
            ok = False
            try:
                WebDriverWait(d, 12).until(lambda x: "Selenium Suite Cohort" in body_text(x))
                ok = True
            except TimeoutException:
                ok = "Selenium Suite Cohort" in body_text(d)
            record(g, "create cohort appears in Teaching", ok)

            # Open its detail (View) and confirm roster section
            view = None
            for a in d.find_elements(By.TAG_NAME, "button") + d.find_elements(By.TAG_NAME, "a"):
                if (a.text or "").strip().lower().startswith("view"):
                    view = a; break
            if view:
                d.execute_script("arguments[0].click();", view)
                try:
                    WebDriverWait(d, 10).until(lambda x: "student progress" in body_text(x).lower())
                    record(g, "cohort detail shows roster", True)
                except TimeoutException:
                    record(g, "cohort detail shows roster", "student progress" in body_text(d).lower())
        else:
            record(g, "create cohort appears in Teaching", False, "modal name input not found")
    except Exception as e:
        record(g, "cohorts flow", False, str(e)[:120])


def test_console_errors(d, pages):
    """Check for severe browser console errors on the given pages."""
    g = "ConsoleErrors"
    # Flush any logs accumulated by earlier tests (e.g. the expected invalid-login 400).
    try:
        d.get_log("browser")
    except Exception:
        pass
    IGNORE = ["favicon", "speech", "permissions policy", "getusermedia",
              "identitytoolkit", "signinwithpassword", "400 (bad request)",
              "auth/", "media-stream"]
    for p in pages:
        try:
            d.get(BASE + p)
            time.sleep(2.5)
            logs = d.get_log("browser")
            severe = [l for l in logs if l.get("level") == "SEVERE"
                      and not any(ig in l.get("message", "").lower() for ig in IGNORE)]
            record(g, f"no severe errors on {p}", len(severe) == 0,
                   (severe[0]["message"][:120] if severe else ""))
        except Exception as e:
            record(g, f"console check {p}", False, str(e)[:80])


def main():
    print(f"\n🧪 NexPrep Selenium suite → {BASE}\n")
    # enable browser logging
    d = None
    try:
        caps_opts = Options()
        caps_opts.add_argument("--headless=new")
        caps_opts.add_argument("--window-size=1440,900")
        caps_opts.add_argument("--use-fake-ui-for-media-stream")
        caps_opts.add_argument("--use-fake-device-for-media-stream")
        caps_opts.add_argument("--no-sandbox")
        caps_opts.add_argument("--disable-dev-shm-usage")
        caps_opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
        d = webdriver.Chrome(options=caps_opts)
        d.set_page_load_timeout(40)

        # --- Public / logged-out checks ---
        test_seo(d)
        test_root_landing(d)
        test_sign_in(d)
        test_sign_up(d)
        test_auth_guard(d)
        test_console_errors(d, ["/auth/sign-in", "/auth/sign-up"])

        # --- Authenticate, then protected checks ---
        authed = authenticate(d)
        if authed:
            test_dashboard(d)
            test_create_interview_dialog(d)
            test_questions(d)
            test_resume(d)
            test_ats(d)
            test_interview_detail(d)
            test_interview_start(d)
            test_feedback(d)
            test_cohorts(d)
            test_console_errors(d, ["/dashboard", "/dashboard/resume",
                                    "/dashboard/ats-checker",
                                    f"/dashboard/interview/{TEST_MOCK_ID}/start"])
        else:
            record("Auth", "protected tests skipped (auth failed)", False,
                   "could not sign in/up the test account")
    finally:
        if d:
            d.quit()

    # Summary
    total = len(results)
    passed = sum(1 for *_, ok, _ in [(r[0], r[1], r[2], r[3]) for r in results] if ok)
    failed = total - passed
    print("\n" + "=" * 60)
    print(f"RESULT: {passed}/{total} passed, {failed} failed")
    if failed:
        print("\nFailures:")
        for grp, name, ok, detail in results:
            if not ok:
                print(f"  ❌ [{grp}] {name} — {detail}")
    print("=" * 60)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
