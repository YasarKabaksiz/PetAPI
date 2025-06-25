using System.ComponentModel.DataAnnotations;

namespace PetAPI.Validation
{
    public class AllowedPetTypesAttribute : ValidationAttribute
    {
        private static readonly string[] AllowedTypes = { "Kedi", "Köpek", "Kuş" };

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string type && AllowedTypes.Contains(type))
            {
                return ValidationResult.Success;
            }
            return new ValidationResult($"Geçersiz tür. Sadece şunlar kabul edilir: {string.Join(", ", AllowedTypes)}");
        }
    }
} 