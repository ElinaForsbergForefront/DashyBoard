export interface ReminderDto {
    id: string;
    title: string;
    description: string;
    date: string;
}

export interface CreateReminderCommand {
    title: string;
    description: string;
    date: string;
}
