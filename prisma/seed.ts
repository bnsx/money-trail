import { createReadStream } from "fs";
import csv from "csv-parser";
import { prisma } from "@/lib/db";

async function importCountryData() {
    const filePath = "prisma/countries.csv";
    const countriesData = [];

    const stream = createReadStream(filePath).pipe(csv({ separator: "," }));

    for await (const row of stream) {
        const {
            name,
            nameTH,
            isoChar2,
            isoChar3,
            isoNumeric,
            currencyCode,
            currencyName,
            currencySymbol,
        } = row;
        countriesData.push({
            name,
            nameTH,
            isoChar2,
            isoChar3,
            isoNumeric: parseInt(isoNumeric, 10),
            currencyCode,
            currencyName,
            currencySymbol,
        });
    }
    console.log("[+] Pushing country data to the database...");
    await prisma.countries.createMany({
        data: countriesData,
        skipDuplicates: true, // Skip duplicate entries
    });

    console.log("[+] Country data has been imported into the table!");
}

async function main() {
    const isExistCountry = await prisma.countries.count();
    if (isExistCountry === 0) {
        console.log("[+] Country data is not available in the table.");
        await importCountryData(); // Create data if not available
    } else {
        console.log("[+] Country data is available in the table!");
    }
    await prisma.$disconnect();
}

main();
