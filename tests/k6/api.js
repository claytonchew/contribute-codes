import { check, group } from "k6";
import http from "k6/http";

////////////////////////////////////////////////////////////////////////////////////////
// VARIABLES
const baseUrl = "http://127.0.0.1:3000/api";

// common headers
const headers = {
  accept: "application/json",
};

////////////////////////////////////////////////////////////////////////////////////////
export const options = {
  vus: 50,
  duration: "60s",
};

////////////////////////////////////////////////////////////////////////////////////////
export function setup() {}

////////////////////////////////////////////////////////////////////////////////////////
export default function () {
  let response;

  group("/projects", function () {
    response = http.post(
      `${baseUrl}/projects`,
      JSON.stringify({
        filters: {},
        pageOptions: {
          page: 1,
          limit: 15,
        },
      }),
      {
        headers: Object.assign({}, headers, {}),
      },
    );

    test(response, {
      "Status 200 OK": (response) => response.status === 200,
    });
  });

  group("/project?id=[id]", function () {
    response = http.get(`${baseUrl}/project?id=b68g739rxvfewwucvw36cske`, {
      headers: Object.assign({}, headers, {}),
    });

    test(response, {
      "Status 200 OK": (response) => response.status === 200,
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////
function test(response, logic) {
  try {
    check(response, logic);
    // output request & response info when error
    outputWhenError(response);
  } catch {
    // prevent error throw that will terminate current iteration
  }
}

function outputWhenError(response) {
  if (response.status !== 200) {
    /* eslint no-console: 0 */
    console.log("---------------------------------------------------");
    console.log(`${response.request.method} ${response.url}`);
    console.log(`-- Response: ${response.status_text}`);
    console.log("---------------------------------------------------");
  }
}
