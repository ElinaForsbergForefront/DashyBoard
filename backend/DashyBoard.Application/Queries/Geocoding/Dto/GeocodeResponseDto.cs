using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.Geocoding.Dto;

public sealed record GeocodeResponseDto(double Latitude, double Longitude, string FormattedAddress);
