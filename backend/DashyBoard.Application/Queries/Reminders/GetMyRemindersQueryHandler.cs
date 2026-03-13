using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Queries.Reminders.Dto; 
using DashyBoard.Application.Interfaces;
using System.Threading;


namespace DashyBoard.Application.Queries.Reminders
{
    public class GetMyRemindersQueryHandler : IRequestHandler<GetMyRemindersQuery, IReadOnlyList<ReminderDto>>
    {
        private readonly IReminderRepository _repository;

        public GetMyRemindersQueryHandler(IReminderRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<ReminderDto>> Handle(GetMyRemindersQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetMyRemindersAsync(
                request.UserId,
                cancellationToken
            );
        }
    }
}
