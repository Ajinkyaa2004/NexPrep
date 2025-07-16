import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent"; // adjust this import path if needed

const Page = async () => {
    const user = await getCurrentUser();

    return (
        <>
            <h3>Interview Generation</h3>
            <Agent userName={user?.name} userId={user?.id} type="generate" />
        </>
    );
};

export default Page;
