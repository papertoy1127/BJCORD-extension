log("BOJ status page detected!");
log("Current user: " + getHandle());
// log(getResultTable());

const currentUrl = window.location.href;
const handle = getHandle();

if (!!handle) {
  if (
    ["status", `user_id=${handle}`, "problem_id", "from_mine=1"].every((key) =>
      currentUrl.includes(key)
    )
  )
    watch();
}

function watch() {
  const interval = setInterval(() => {
    const table = getResultTable();
    if (!table || table.length == 0) return;

    const data = table[0];

    if (
      data.hasOwnProperty("username") &&
      data.hasOwnProperty("resultCategory")
    ) {
      const { username, resultCategory } = data;

      if (username == getHandle()) {
        if (resultCategory == "judging" || resultCategory == "compile") return;

        const time = getTimeDifference(data.submissionTime);
        if (time > 120) return;

        clearInterval(interval);
        log("Submission detected: " + resultCategory);
        log(data);
        log("Sending message to Discord...");

        const msg = getWebhookMessage(
          getHandle(),
          data.submissionId,
          data.problemId,
          data.language,
          data.memory,
          data.resultCategory,
          data.runtime,
          data.codeLength
        );
        sendMessage(
          msg,
          "https://discord.com/api/webhooks/1236995046964727869/r5bHZKznebAt1TFeaHQZ3ATenc_zT_Xr9QFCtCycMxFw-4CUXOAK8JQi15aAZUOGlOUu"
        );
      }
    }
  }, 1000);
}
