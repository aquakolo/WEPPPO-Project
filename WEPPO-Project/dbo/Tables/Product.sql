CREATE TABLE [dbo].[Product] (
    [Id]          INT             IDENTITY (1, 1) NOT NULL,
    [title]       VARCHAR (MAX)   NOT NULL,
    [description] VARCHAR (MAX)   NULL,
    [value]       FLOAT (53)      NOT NULL,
    [image]       VARBINARY (MAX) NULL,
    [status]      BIT             NOT NULL,
    CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([Id] ASC)
);

