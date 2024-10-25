using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UserFriends : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Organizations_Users_CreatorId",
                table: "Organizations");

            migrationBuilder.CreateTable(
                name: "Friends",
                columns: table => new
                {
                    FriendsId = table.Column<int>(type: "integer", nullable: false),
                    FriendsOfId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friends", x => new { x.FriendsId, x.FriendsOfId });
                    table.ForeignKey(
                        name: "FK_Friends_Users_FriendsId",
                        column: x => x.FriendsId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friends_Users_FriendsOfId",
                        column: x => x.FriendsOfId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Friends_FriendsOfId",
                table: "Friends",
                column: "FriendsOfId");

            migrationBuilder.AddForeignKey(
                name: "FK_Organizations_Users_CreatorId",
                table: "Organizations",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Organizations_Users_CreatorId",
                table: "Organizations");

            migrationBuilder.DropTable(
                name: "Friends");

            migrationBuilder.AddForeignKey(
                name: "FK_Organizations_Users_CreatorId",
                table: "Organizations",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
