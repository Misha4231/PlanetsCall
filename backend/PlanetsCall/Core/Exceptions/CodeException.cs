namespace PlanetsCall.Controllers.Exceptions;

/*
 * Class inherited by Exception to provide HTTP code inside
 * object and return correct response
 */
public class CodeException : Exception
{
    public CodeException(string message, int code) : base(message)
    {
        Code = code;
    }

    public int Code { get; }
}