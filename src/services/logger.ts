export const log = (platform: string, user: string, input: string, output: string, extra: string = "") => {
  let message =
    `${platform} @ ${user}
    input: ${input}
    output: ${output}
  `

  if (extra) message += `extra: ${extra}`

  console.log(message);
}