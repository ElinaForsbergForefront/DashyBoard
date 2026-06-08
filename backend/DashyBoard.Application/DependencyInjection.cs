using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Utilities;
using Microsoft.Extensions.DependencyInjection;

namespace DashyBoard.Application
{
    /// <summary>
    /// This class is responsible for registering all services
    /// belonging to the Application layer.
    ///
    /// Currently we register MediatR and all handlers (Queries/Commands)
    /// so they can be resolved via Dependency Injection.
    ///
    /// Without this registration, _mediator.Send(...)
    /// would throw an "Unable to resolve service" error because
    /// MediatR would not know about our handlers.
    /// </summary>
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Registers all IRequestHandler implementations in the Application assembly
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
            services.AddScoped<IWidgetConfigurationService, WidgetConfigurationService>();
    
            return services;
        }
    }
}
