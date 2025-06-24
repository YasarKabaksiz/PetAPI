using System;

namespace PetAPI.Services
{
    public static class LevelingHelper
    {
        public static int GetXpForNextLevel(int level)
        {
            return level * 100;
        }
    }
} 