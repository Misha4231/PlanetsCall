using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class SelectedItemsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SelectedItems",
                columns: table => new
                {
                    CurrentlySelectingId = table.Column<int>(type: "integer", nullable: false),
                    ItemsSelectedId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectedItems", x => new { x.CurrentlySelectingId, x.ItemsSelectedId });
                    table.ForeignKey(
                        name: "FK_SelectedItems_Items_ItemsSelectedId",
                        column: x => x.ItemsSelectedId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SelectedItems_Users_CurrentlySelectingId",
                        column: x => x.CurrentlySelectingId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectedItems_ItemsSelectedId",
                table: "SelectedItems",
                column: "ItemsSelectedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectedItems");
        }
    }
}
