import { stat, unlink } from "fs/promises";
import { join } from "path";

import { assert } from "chai";

import { Camperbot } from "../../src/interfaces/Camperbot";
import { createLogFile } from "../../src/modules/createLogFile";

suite("createLogFile", () => {
  test("is defined", () => {
    assert.isDefined(createLogFile, "createLogFile is not defined");
    assert.isFunction(createLogFile, "createLogFile is not a function");
  });

  test("returns the expected data structure", async () => {
    const mockBot = { private_logs: {} } as Camperbot;
    await createLogFile(mockBot, "Naomi");
    assert.property(mockBot.private_logs, "Naomi", "Naomi is not defined");
    assert.equal(mockBot.private_logs.Naomi, "Naomi", "Naomi is not Naomi");
    const logPath = join(process.cwd(), "logs", "Naomi.txt");
    const status = await stat(logPath);
    assert.isTrue(status.isFile(), "Naomi.txt is not a file");
    await unlink(logPath);
  });
});
