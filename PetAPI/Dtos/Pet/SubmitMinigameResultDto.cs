namespace PetAPI.Dtos.Pet
{
    public class SubmitMinigameResultDto
    {
        public string GameType { get; set; } = string.Empty; // "feed" veya "play"
        public int Score { get; set; }
    }
} 