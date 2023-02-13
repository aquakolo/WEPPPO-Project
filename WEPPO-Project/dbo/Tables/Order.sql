CREATE TABLE [dbo].[Order] (
    [Id]         INT        IDENTITY (1, 1) NOT NULL,
    [customerId] INT        NOT NULL,
    [sumValue]   FLOAT (53) NOT NULL,
    [status]     BIT        NOT NULL,
    [time]       DATETIME   NULL,
    CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Order_User] FOREIGN KEY ([Id]) REFERENCES [dbo].[User] ([Id])
);

