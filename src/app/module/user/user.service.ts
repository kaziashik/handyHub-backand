import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

const uploadProfileImage = async (buffer: Buffer, userId: string) => {
  // const cloudinaryResult = cloudinary.uploader.upload_stream(
  //     {
  //         resource_type : "auto"
  //     },

  //     async (error, result) => {
  //         if(error){
  //             console.log(error);
  //             throw new Error(error.message)
  //         }

  //         console.log(result, "result");

  //         const updatedUser = await prisma.user.update({
  //             where : {
  //                 id : userId
  //             },

  //             data: {
  //                 imageUrl : result?.secure_url,
  //                 imagePublicId : result?.public_id
  //             }
  //         })

  //         console.log(updatedUser);

  //         // return result
  //     }
  // ).end(buffer)

  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      imagePublicId: true,
      imageUrl: true,
    },
  });

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },

          async (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }

            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      imageUrl: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
    },

    include: { auths: { omit: { password: true } } },
  });

  if (currentUser?.imagePublicId && currentUser.imageUrl) {
    await cloudinary.uploader.destroy(currentUser.imagePublicId);
  }

  return updatedUser;
};

const updateProfile = async (
  userId: string,
  payload: { name: string; phone?: string },
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      phone: payload.phone ? payload.phone : null,
    },
    omit: { password: true },
  });
};

const getCustomers = async (query: {
  searchTerm?: string;
  page?: string;
  limit?: string;
}) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const where = {
    role: "CUSTOMER" as const,
    isDeleted: false,
    ...(query.searchTerm
      ? {
          OR: [
            { name: { contains: query.searchTerm, mode: "insensitive" as const } },
            { email: { contains: query.searchTerm, mode: "insensitive" as const } },
            { phone: { contains: query.searchTerm, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const UserServices = {
  uploadProfileImage,
  updateProfile,
  getCustomers,
};
