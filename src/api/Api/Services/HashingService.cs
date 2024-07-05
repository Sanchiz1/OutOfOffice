using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace Api.Services;

public class HashingService
{
        public string ComputeHash(string password)
        {
            var decodedSalt = Convert.FromBase64String("U3VwZXJTZWNyZXRTYWx0");

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: decodedSalt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return hashed;
        }
}
