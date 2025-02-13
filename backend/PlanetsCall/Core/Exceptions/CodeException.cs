namespace PlanetsCall.Controllers.Exceptions;

/*
 * Class inherited by Exception to provide HTTP code inside
 * object and return correct response
 */
public class CodeException(string message, int code) : Exception(message)
{
    public int Code { get; } = code;
}