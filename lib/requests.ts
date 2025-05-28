import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { hidePageLoader, showPageLoader } from "./helper";
import { toast } from "sonner";

export const updateStory = async (payload: any, storyId: string) => {
    try {
        showPageLoader();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${storyId}`;
        let res = await axiosInterceptorInstance.put(url, payload);
        console.log(res);
        toast.success("Progress saved");
        return res;

    } catch (error) {
        console.error('Error saving:', error);
        return false;
    } finally {
        hidePageLoader();
    }
};
