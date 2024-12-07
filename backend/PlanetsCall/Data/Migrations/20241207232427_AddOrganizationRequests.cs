using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizationRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrganizationRequests",
                columns: table => new
                {
                    RequestedOrganizationsId = table.Column<int>(type: "integer", nullable: false),
                    RequestsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationRequests", x => new { x.RequestedOrganizationsId, x.RequestsId });
                    table.ForeignKey(
                        name: "FK_OrganizationRequests_Organizations_RequestedOrganizationsId",
                        column: x => x.RequestedOrganizationsId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationRequests_Users_RequestsId",
                        column: x => x.RequestsId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationRequests_RequestsId",
                table: "OrganizationRequests",
                column: "RequestsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrganizationRequests");
        }
    }
}
