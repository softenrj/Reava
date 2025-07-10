import ShowToast from '@/Components/common/showToast'

export const useToast = () => {

    return {
        showSuccess: (title: string, message?: string) =>
            ShowToast({
                title: 'hello',
            })
    }
}
