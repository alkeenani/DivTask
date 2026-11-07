//? Function Open List
export function OpenList(...elelments) {
  elelments.forEach((elelment) => {
    elelment.classList.add("show");
  });
}
//? Function Colse List

export function CloseList(...elelments) {
  elelments.forEach((elelment) => {
    elelment.classList.remove("show");
  });
}
