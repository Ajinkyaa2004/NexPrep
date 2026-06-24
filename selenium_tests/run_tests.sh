#!/usr/bin/env bash
# Runs the NexPrep Selenium suite end-to-end.
#
# Prereqs:
#   - Dev server running:  npm run dev   (http://localhost:3000)
#   - Local MongoDB running (brew services start mongodb-community)
#   - pip install selenium   (Selenium 4 auto-manages ChromeDriver)
#
# Usage:  bash selenium_tests/run_tests.sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export MONGODB_URI="${MONGODB_URI:-mongodb://127.0.0.1:27017/nexprep}"
export BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "▶ Checking app at $BASE_URL ..."
if ! node -e "fetch('$BASE_URL/auth/sign-in').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
  echo "✗ App is not reachable at $BASE_URL. Start it with: npm run dev"
  exit 1
fi

echo "▶ Seeding deterministic test data ..."
node selenium_tests/seed_test_data.js | grep SEED_OK

echo "▶ Running Selenium suite ..."
python3 selenium_tests/test_nexprep.py
STATUS=$?

echo "▶ Cleaning up test data ..."
mongosh "$MONGODB_URI" --quiet --eval '
  db.mockinterviews.deleteMany({mockId:"selenium-test-interview"});
  db.useranswers.deleteMany({mockIdRef:"selenium-test-interview"});
  db.cohorts.deleteMany({name:"Selenium Suite Cohort"});
' >/dev/null 2>&1 || true

exit $STATUS
