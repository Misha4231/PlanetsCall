using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class MoveOrganizationRolesToManyToManyRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationUserRoles_OrganizationRoles_OrganizationRoleId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationUserRoles_Organizations_OrganisationId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationUserRoles_Users_UserId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrganizationUserRoles",
                table: "OrganizationUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationUserRoles_OrganisationId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationUserRoles_OrganizationRoleId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "OrganizationUserRoles");

            migrationBuilder.DropColumn(
                name: "OrganisationId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "OrganizationUserRoles");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "OrganizationUserRoles",
                newName: "UsersWithRoleId");

            migrationBuilder.RenameColumn(
                name: "OrganizationRoleId",
                table: "OrganizationUserRoles",
                newName: "OrganizationRolesId");

            migrationBuilder.RenameIndex(
                name: "IX_OrganizationUserRoles_UserId",
                table: "OrganizationUserRoles",
                newName: "IX_OrganizationUserRoles_UsersWithRoleId");

            migrationBuilder.AddColumn<int>(
                name: "OrganisationId",
                table: "OrganizationRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrganisationsId",
                table: "OrganizationRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrganizationUserRoles",
                table: "OrganizationUserRoles",
                columns: new[] { "OrganizationRolesId", "UsersWithRoleId" });

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

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationUserRoles_OrganizationRoles_OrganizationRolesId",
                table: "OrganizationUserRoles",
                column: "OrganizationRolesId",
                principalTable: "OrganizationRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationUserRoles_Users_UsersWithRoleId",
                table: "OrganizationUserRoles",
                column: "UsersWithRoleId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationRoles_Organizations_OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationUserRoles_OrganizationRoles_OrganizationRolesId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrganizationUserRoles_Users_UsersWithRoleId",
                table: "OrganizationUserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrganizationUserRoles",
                table: "OrganizationUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationRoles_OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.DropColumn(
                name: "OrganisationId",
                table: "OrganizationRoles");

            migrationBuilder.DropColumn(
                name: "OrganisationsId",
                table: "OrganizationRoles");

            migrationBuilder.RenameColumn(
                name: "UsersWithRoleId",
                table: "OrganizationUserRoles",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "OrganizationRolesId",
                table: "OrganizationUserRoles",
                newName: "OrganizationRoleId");

            migrationBuilder.RenameIndex(
                name: "IX_OrganizationUserRoles_UsersWithRoleId",
                table: "OrganizationUserRoles",
                newName: "IX_OrganizationUserRoles_UserId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "OrganizationUserRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "OrganisationId",
                table: "OrganizationUserRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "OrganizationUserRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrganizationUserRoles",
                table: "OrganizationUserRoles",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationUserRoles_OrganisationId",
                table: "OrganizationUserRoles",
                column: "OrganisationId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationUserRoles_OrganizationRoleId",
                table: "OrganizationUserRoles",
                column: "OrganizationRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationUserRoles_OrganizationRoles_OrganizationRoleId",
                table: "OrganizationUserRoles",
                column: "OrganizationRoleId",
                principalTable: "OrganizationRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationUserRoles_Organizations_OrganisationId",
                table: "OrganizationUserRoles",
                column: "OrganisationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrganizationUserRoles_Users_UserId",
                table: "OrganizationUserRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
