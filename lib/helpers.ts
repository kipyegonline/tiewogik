export async function submitForm(
  formData: Record<string, string>,
  formSubmitEndpoint: string
) {
  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();

      return result;
    } else {
      throw Error("something went Wrong");
    }
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}
