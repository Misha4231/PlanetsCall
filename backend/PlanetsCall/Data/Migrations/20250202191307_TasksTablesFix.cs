using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class TasksTablesFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TasksVerification_Users_UserId",
                table: "TasksVerification");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationVerificationRequests_OrganisationId",
                table: "OrganizationVerificationRequests");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "TasksVerification");

            migrationBuilder.DropColumn(
                name: "IsGroup",
                table: "TasksVerification");

            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "UpdateAt",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TasksVerification",
                newName: "ExecutorId");

            migrationBuilder.RenameIndex(
                name: "IX_TasksVerification_UserId",
                table: "TasksVerification",
                newName: "IX_TasksVerification_ExecutorId");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Tasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsGroup",
                table: "Tasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationVerificationRequests_OrganisationId",
                table: "OrganizationVerificationRequests",
                column: "OrganisationId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TasksVerification_Users_ExecutorId",
                table: "TasksVerification",
                column: "ExecutorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TasksVerification_Users_ExecutorId",
                table: "TasksVerification");

            migrationBuilder.DropIndex(
                name: "IX_OrganizationVerificationRequests_OrganisationId",
                table: "OrganizationVerificationRequests");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "IsGroup",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "ExecutorId",
                table: "TasksVerification",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TasksVerification_ExecutorId",
                table: "TasksVerification",
                newName: "IX_TasksVerification_UserId");

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "TasksVerification",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsGroup",
                table: "TasksVerification",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "Tasks",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateAt",
                table: "Tasks",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationVerificationRequests_OrganisationId",
                table: "OrganizationVerificationRequests",
                column: "OrganisationId");

            migrationBuilder.AddForeignKey(
                name: "FK_TasksVerification_Users_UserId",
                table: "TasksVerification",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
