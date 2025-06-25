namespace PetAPI.Dtos.Pet
{
    public class PetDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Level { get; set; }
        public int Experience { get; set; }
        public int Hunger { get; set; }
        public int Happiness { get; set; }
        public int Health { get; set; }
        public string? Nickname { get; set; }
    }
} 