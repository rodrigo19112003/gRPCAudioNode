const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const dotenv = require("dotenv");
const PROTO_PATH = "./proto/audio.proto"
const portAudio = require('naudiodon');

dotenv.config();

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const audioProto = grpc.loadPackageDefinition(packageDefinition);

const stub = new audioProto.AudioService(`localhost:${process.env.SERVER_PORT}`, grpc.credentials.createInsecure());

fileName = "anyma.wav";
streamAudio(stub, fileName);

function streamAudio(stub, fileName){
    var ao = new portAudio.AudioIO({
        outOptions: {
            channelCount: 2,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 48000
        }
    });
    ao.start();

    console.log(`\nReproduciendo el archivo: ${fileName}`);

    stub.downloadAudio({
        name: fileName
    }).on('data', (DataChunkResponse) => {
        process.stdout.write('.')
        ao.write(DataChunkResponse.data)
    }).on('end', function () {
        console.log('\nRecepción de datos correcta.');
    });
}


