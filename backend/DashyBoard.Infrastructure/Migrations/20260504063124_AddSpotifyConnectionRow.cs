using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DashyBoard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSpotifyConnectionRow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "SpotifyConnections",
                type: "bytea",
                rowVersion: true,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "SpotifyConnections");
        }
    }
}
