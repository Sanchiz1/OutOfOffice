namespace Api.Models;

public class Token
{
    public required string Value {  get; set; }
    public DateTime Issued { get; set; }
    public DateTime Expires { get; set; }
}
