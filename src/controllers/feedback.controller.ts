import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createForm = async (req: Request, res: Response) => {
  const data = req.body;
  const { formName, formFields } = data;
  try {
    const form = await prisma.form.create({
      data: {
        formName,
        formFields: {
          create: formFields.map((field: any) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            errorMessage: field.errorMessage,
            value: field.value,
            placeholder: field.placeholder,
            options: field.options,
            subtype: field.subtype,
          })),
        },
      },
      include: { formFields: true },
    });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
};

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({ include: { formFields: true } });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve forms" });
  }
};

export const getForm = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { formFields: true },
    });
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve form" });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { formFields } = req.body;

  try {
    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const response = await prisma.response.create({
      data: {
        form: { connect: { id: form.id } },
        formFields: {
          create: formFields.map((field: any) => ({
            value: field.value,
            formField: { connect: { id: field.id } },
          })),
        },
      },
      include: {
        form: true,
        formFields: {
          include: {
            formField: true,
          },
        },
      },
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit response" });
  }
};

export const getFormResponses = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const formWithResponses = await prisma.form.findUnique({
      where: { id },
      include: {
        formFields: true,
        responses: {
          include: {
            formFields: {
              include: {
                formField: true,
              },
            },
          },
        },
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!formWithResponses) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formattedResponses = formWithResponses.responses.map((response) => ({
      responseId: response.id,
      createdAt: response.createdAt,
      fields: response.formFields.map((fieldResponse) => ({
        label: fieldResponse.formField.label,
        value: fieldResponse.value,
      })),
    }));

    const result = {
      formId: formWithResponses.id,
      createdAt: formWithResponses.createdAt,
      formName: formWithResponses.formName,
      responseCount: formWithResponses._count.responses,
      responses: formattedResponses,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching form responses:", error);
    res.status(500).json({ error: "Failed to fetch form responses" });
  }
};

export const getAllFormsOverview = async (req: Request, res: Response) => {
  try {
    const formsOverview = await prisma.form.findMany({
      select: {
        id: true,
        createdAt: true,
        formName: true,
        _count: {
          select: { responses: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = formsOverview.map((form) => ({
      formId: form.id,
      createdAt: form.createdAt,
      formName: form.formName,
      submissionCount: form._count.responses,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching forms overview:", error);
    res.status(500).json({ error: "Failed to fetch forms overview" });
  }
};
