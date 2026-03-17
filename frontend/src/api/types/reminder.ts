export interface ReminderDto {
    id: string;
    userId: string;
    title: string;
    note?: string;
    dueAtUtc: string;
    isCompleted: boolean;
    createdAtUtc: string;
    completedAtUtc?: string;
}

export interface CreateReminderCommand {
    title: string;
    dueAtUtc: string;
    note?: string;
}

export interface UpdateReminderCommand {
    id: string;
    title: string;
    dueAtUtc: string;
    note?: string;
}

export interface CompleteReminderCommand {
    id: string;
}

export interface DeleteReminderCommand {
    id: string;
}

export interface UncompleteReminderCommand {
    id: string;
}
