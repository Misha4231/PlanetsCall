namespace PlanetsCall.Controllers.Exceptions;

// object representing an response error to match errors from ef core validation style
public class ErrorResponse
{
    public string Title { get; set; }
    public int Status { get; set; }
    public string TraceId { get; set; }
    public IDictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>();
    
    public ErrorResponse(List<string> msg, int status, string traceId)
    {
        Title = "One or more validation errors occurred.";
        Status = status;
        TraceId = traceId;
        Errors = new Dictionary<string, string[]>
        {
            { "CustomValidation", msg.ToArray() }
        };
    }
}