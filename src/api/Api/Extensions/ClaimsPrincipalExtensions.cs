using System.Security.Claims;

namespace Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        ArgumentNullException.ThrowIfNull(principal);

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return userId == null ? 0 : Convert.ToInt32(userId);
    }
}
