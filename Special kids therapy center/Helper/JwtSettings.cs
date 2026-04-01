namespace Special_kids_therapy_center.Helper
{
    public class JwtSettings
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpiryInDays { get; set; }
    }
}
