import React from 'react';
import { LuCircleAlert } from 'react-icons/lu';

const MessageError = (props) => {
    const {children} = props;

    return (
        <div class="rounded-xl border border-red-500 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/15">
            <div class="flex items-start gap-3">
                <div class="mt-0.5 text-red-500">
                    <LuCircleAlert />
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessageError;