using Serilog;
using System.Net;
using System.Text.Json;

namespace PetAPI.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        public GlobalExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string message = "Sunucuda beklenmedik bir hata oluştu.";

            if (exception is KeyNotFoundException)
            {
                statusCode = (int)HttpStatusCode.NotFound;
                message = "İstenen kaynak bulunamadı.";
            }
            // Diğer özel exception türleri burada eklenebilir

            Log.Error(exception, "Bir hata oluştu: {Message}", exception.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new { statusCode, message };
            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}