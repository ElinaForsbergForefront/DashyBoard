using DashyBoard.Application.Queries.Geocoding.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.Geocoding;

public sealed record GeocodeAddressQuery(string Address) : IRequest<GeocodeResponseDto?>;
