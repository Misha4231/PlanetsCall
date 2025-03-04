namespace Core.Exceptions;

// object representing a response error to match errors from ef core validation style
public class ErrorResponse(List<string> msg, int status, string traceId)
{
    public string Title { get; set; } = "One or more validation errors occurred.";
    public int Status { get; set; } = status;
    public string TraceId { get; set; } = traceId;
    public IDictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>
    {
        { "CustomValidation", msg.ToArray() }
    };
}