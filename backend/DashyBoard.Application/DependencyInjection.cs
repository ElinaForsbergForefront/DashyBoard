using Microsoft.Extensions.DependencyInjection;

namespace DashyBoard.Application
{
    /// <summary>
    /// Denna klass ansvarar för att registrera alla services
    /// som tillhör Application-lagret.
    ///
    /// Just nu registrerar vi MediatR och alla handlers (Queries/Commands)
    /// så att de kan resolvas via Dependency Injection.
    ///
    /// Utan denna registrering skulle _mediator.Send(...)
    /// kasta "Unable to resolve service"-fel eftersom
    /// MediatR inte känner till våra handlers.
    /// </summary>
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Registrerar alla IRequestHandler-implementationer i Application-assemblyn
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
    
            return services;
        }
    }
}
