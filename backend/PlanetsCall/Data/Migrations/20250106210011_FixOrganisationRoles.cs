using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class FixOrganisationRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationRoles_Organizations_OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationRoles_OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.DropColumn(
                name: "OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationRoles_OrganisationId",
                table: "OrganizationRoles",
                column: "OrganisationId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationRoles_Organizations_OrganisationId",
                table: "OrganizationRoles",
                column: "OrganisationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationRoles_Organizations_OrganisationId",
                table: "OrganizationRoles");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationRoles_OrganisationId",
                table: "OrganizationRoles");

            migrationBuilder.AddColumn<int>(
                name: "OrganisationsId",
                table: "OrganizationRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationRoles_OrganisationsId",
                table: "OrganizationRoles",
                column: "OrganisationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationRoles_Organizations_OrganisationsId",
                table: "OrganizationRoles",
                column: "OrganisationsId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
