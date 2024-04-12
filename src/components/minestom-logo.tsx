import logo from "~/assets/minestom-logo.png";

export default function MinestomLogo() {
  return (
    <div class="flex font-semibold flex-row items-center gap-2">
      <img class="w-6" src={logo} />
      Minestom
    </div>
  );
}
