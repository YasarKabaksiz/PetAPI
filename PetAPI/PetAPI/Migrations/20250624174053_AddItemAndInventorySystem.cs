using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PetAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddItemAndInventorySystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false),
                    ItemType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectValue = table.Column<int>(type: "int", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserInventories",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInventories", x => new { x.UserId, x.ItemId });
                    table.ForeignKey(
                        name: "FK_UserInventories_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserInventories_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "Id", "Description", "EffectValue", "ImageUrl", "ItemType", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Evcil hayvanın açlığını biraz giderir.", 15, "/images/items/food1.png", "Food", "Küçük Mama", 10 },
                    { 2, "Evcil hayvanın açlığını büyük oranda giderir.", 40, "/images/items/food2.png", "Food", "Büyük Mama", 25 },
                    { 3, "Evcil hayvanın açlığını tamamen giderir.", 100, "/images/items/food3.png", "Food", "Lezzetli Ödül", 50 },
                    { 4, "Evcil hayvanın mutluluğunu artırır.", 20, "/images/items/toy1.png", "Toy", "Top", 20 },
                    { 5, "Evcil hayvanın mutluluğunu büyük oranda artırır.", 50, "/images/items/toy2.png", "Toy", "Kedi Tırmalama Tahtası", 45 },
                    { 6, "Evcil hayvanın mutluluğunu tamamen artırır.", 100, "/images/items/toy3.png", "Toy", "Peluş Oyuncak", 80 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserInventories_ItemId",
                table: "UserInventories",
                column: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserInventories");

            migrationBuilder.DropTable(
                name: "Items");
        }
    }
}
