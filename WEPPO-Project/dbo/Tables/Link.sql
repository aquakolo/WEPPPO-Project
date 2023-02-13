CREATE TABLE [dbo].[Link] (
    [Id]        INT IDENTITY (1, 1) NOT NULL,
    [productId] INT NOT NULL,
    [orderId]   INT NOT NULL,
    CONSTRAINT [PK_Link] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Link_Order] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order] ([Id]),
    CONSTRAINT [FK_Link_Product] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([Id])
);

