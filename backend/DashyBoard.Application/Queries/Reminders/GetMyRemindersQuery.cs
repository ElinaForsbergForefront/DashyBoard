using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Queries.Reminders.Dto;

namespace DashyBoard.Application.Queries.Reminders
{
    public sealed record GetMyRemindersQuery(
       Guid UserId
   ) : IRequest<IReadOnlyList<ReminderDto>>;
}
