using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PetAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHabitatDecoration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FloorItemId",
                table: "Pets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WallItemId",
                table: "Pets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlacementArea",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 1,
                column: "PlacementArea",
                value: null);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 2,
                column: "PlacementArea",
                value: null);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 3,
                column: "PlacementArea",
                value: null);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 4,
                column: "PlacementArea",
                value: null);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 5,
                column: "PlacementArea",
                value: null);

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 6,
                column: "PlacementArea",
                value: null);

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "Id", "Description", "EffectValue", "ImageUrl", "ItemType", "Name", "PlacementArea", "Price" },
                values: new object[,]
                {
                    { 7, "Geceleri yıldızlarla dolu güzel bir duvar kağıdı.", null, "/images/items/starry-wall.png", "Decoration", "Yıldızlı Gece Duvarı", "Wall", 100 },
                    { 8, "Yeşil orman manzarası ile huzurlu bir atmosfer.", null, "/images/items/forest-wall.png", "Decoration", "Orman Manzarası Duvarı", "Wall", 120 },
                    { 9, "Doğal ahşap parke zemin.", null, "/images/items/wooden-floor.png", "Decoration", "Ahşap Parke", "Floor", 80 },
                    { 10, "Sıcak ve yumuşak halı zemin.", null, "/images/items/soft-carpet.png", "Decoration", "Yumuşak Halı", "Floor", 90 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DropColumn(
                name: "FloorItemId",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "WallItemId",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "PlacementArea",
                table: "Items");
        }
    }
}
