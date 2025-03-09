using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class NullableInspectorId_TasksVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TasksVerification_Users_InspectorId",
                table: "TasksVerification");

            migrationBuilder.AlterColumn<int>(
                name: "InspectorId",
                table: "TasksVerification",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_TasksVerification_Users_InspectorId",
                table: "TasksVerification",
                column: "InspectorId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TasksVerification_Users_InspectorId",
                table: "TasksVerification");

            migrationBuilder.AlterColumn<int>(
                name: "InspectorId",
                table: "TasksVerification",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TasksVerification_Users_InspectorId",
                table: "TasksVerification",
                column: "InspectorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
