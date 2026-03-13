using DashyBoard.Domain.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace DashyBoard.Infrastructure.Configuration;

public static class MongoDbConfigurator
{
    public static void Configure()
    {
        if (!BsonClassMap.IsClassMapRegistered(typeof(Mirror)))
        {
            BsonClassMap.RegisterClassMap<Mirror>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(m => m.Id).SetSerializer(new GuidSerializer(BsonType.String));
            });
        }
    }
}
