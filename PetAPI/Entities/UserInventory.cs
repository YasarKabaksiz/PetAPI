using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetAPI.Entities
{
    public class UserInventory
    {
        [Key, Column(Order = 0)]
        public int UserId { get; set; }
        public User User { get; set; }

        [Key, Column(Order = 1)]
        public int ItemId { get; set; }
        public Item Item { get; set; }

        public int Quantity { get; set; }
    }
} 