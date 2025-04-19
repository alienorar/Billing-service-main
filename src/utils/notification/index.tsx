import { notification } from 'antd';

// ============Notification=============
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (type: NotificationType, message: string, description: string) => {
    notification[type]({
        message,
        description,
        placement: 'topRight',
        showProgress: true,
    });
};
