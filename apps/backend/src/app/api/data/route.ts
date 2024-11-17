import { MongoClient } from 'mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get('page') || '1');
        if (page < 1) page = 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
        const db = client.db('potholes');
        const collection = db.collection('potholes_data');

        const data = await collection
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await collection.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        await client.close();

        return Response.json({
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
        const db = client.db('potholes');
        const collection = db.collection('potholes_data');

        const result = await collection.insertOne({
            timestamp: new Date(),
            ...body,
        });

        await client.close();

        return Response.json({
            success: true,
            insertedId: result.insertedId
        }, { status: 201 });

    } catch (error) {
        console.error('Error adding data:', error);
        return Response.json(
            { error: 'Failed to add data' },
            { status: 500 }
        );
    }
}